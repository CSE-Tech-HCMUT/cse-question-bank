package req

type AddPolicyRequest struct {
	Role   string `json:"role"`
	Object string `json:"object"`
	Method string `json:"method"`
}
