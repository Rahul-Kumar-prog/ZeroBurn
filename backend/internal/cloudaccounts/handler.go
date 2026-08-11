package cloudaccounts

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"regexp"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sts"
)

// cfnTemplateURL is the public S3 URL for the Zeroburn CloudFormation template.
const cfnTemplateURL = "https://zeroburn-cfn-templates.s3.us-east-1.amazonaws.com/iam-role-template.yaml"

// zeroburnAccountID is the AWS account ID that hosts the Zeroburn service.
// The IAM role in the customer account trusts this account.
var zeroburnAccountID = func() string {
	if v := os.Getenv("ZEROBURN_AWS_ACCOUNT_ID"); v != "" {
		return v
	}
	return "574667602911" // default from CFN template principal
}()

var accountIDRegex = regexp.MustCompile(`^\d{12}$`)

type connectRequest struct {
	AccountID string `json:"account_id"`
}

type connectResponse struct {
	CfnURL string `json:"cfn_url"`
}

// statusResponse is returned by GET /api/aws/status
type statusResponse struct {
	// "connected" | "not_found" | "error"
	Status  string `json:"status"`
	Message string `json:"message,omitempty"`
}

type errorResponse struct {
	Error string `json:"error"`
}

// HandleConnect validates the AWS account ID and returns a pre-built
// CloudFormation console URL that the frontend opens in a new tab.
func HandleConnect(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req connectRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(errorResponse{Error: "invalid request body"})
		return
	}

	if !accountIDRegex.MatchString(req.AccountID) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(errorResponse{Error: "account_id must be exactly 12 digits"})
		return
	}

	cfnURL := buildCfnURL(req.AccountID)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(connectResponse{CfnURL: cfnURL})
}

// HandleStatus checks whether the Zeroburn IAM role exists in the customer's
// AWS account by attempting sts:AssumeRole. The ExternalId passed as
// param_ExternalId during CloudFormation creation equals the account ID.
//
// GET /api/aws/status?account_id=<12-digit-id>
func HandleStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	accountID := r.URL.Query().Get("account_id")
	if !accountIDRegex.MatchString(accountID) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(errorResponse{Error: "account_id must be exactly 12 digits"})
		return
	}

	roleARN := fmt.Sprintf("arn:aws:iam::%s:role/ZeroburnReadOnlyRole", accountID)
	externalID := accountID // we pass account_id as ExternalId during CFN creation

	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(statusResponse{Status: "error", Message: "failed to load AWS config"})
		return
	}

	stsClient := sts.NewFromConfig(cfg)

	_, err = stsClient.AssumeRole(context.Background(), &sts.AssumeRoleInput{
		RoleArn:         aws.String(roleARN),
		RoleSessionName: aws.String("ZeroburnStatusCheck"),
		ExternalId:      aws.String(externalID),
		DurationSeconds: aws.Int32(900), // minimum allowed
	})
	if err != nil {
		// Role doesn't exist yet or the trust policy isn't ready
		w.WriteHeader(http.StatusOK) // still a valid response, just not connected
		json.NewEncoder(w).Encode(statusResponse{
			Status:  "not_found",
			Message: "IAM role not found — CloudFormation stack may still be creating",
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(statusResponse{Status: "connected"})
}

// buildCfnURL constructs the CloudFormation quick-create console URL.
// Opening this URL in a browser takes the user directly to the
// "Quick create stack" page pre-filled with the template and ExternalId.
func buildCfnURL(accountID string) string {
	base := "https://console.aws.amazon.com/cloudformation/home"

	regionParam := url.Values{}
	regionParam.Set("region", "us-east-1")

	// Fragment query string — CloudFormation quick-create format
	fragmentParams := url.Values{}
	fragmentParams.Set("templateURL", cfnTemplateURL)
	fragmentParams.Set("stackName", "ZeroburnRole")
	fragmentParams.Set("param_ExternalId", accountID)

	return base + "?" + regionParam.Encode() + "#/stacks/quickcreate?" + fragmentParams.Encode()
}
