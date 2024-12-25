package casbin

import (
	"fmt"
	"os"

	"github.com/casbin/casbin/v2"
	"github.com/casbin/casbin/v2/model"
	gormadapter "github.com/casbin/gorm-adapter/v3"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CasbinService struct {
	Enforcer *casbin.Enforcer
}

func NewCasbinService(db *gorm.DB) (*CasbinService, error) {
	m, err := model.NewModelFromString(`
	[request_definition]
	r = sub, obj, act

	[policy_definition]
	p = sub, obj, act

	[policy_effect]
	e = some(where (p.eft == allow))

	[matchers]
	m = r.sub == p.sub && r.obj == p.obj && r.act == p.act
	`)
	if err != nil {
		return nil, err
	}

	var (
		password = os.Getenv("DB_PASSWORD")
		username = os.Getenv("DB_USERNAME")
		port     = os.Getenv("DB_PORT")
		host     = os.Getenv("DB_HOST")
	)

	// Use the Gorm adapter for storing policies
	dataSourceName := fmt.Sprintf("%s:%s@tcp(%s:%s)/", username, password, host, port)
	adapter, err := gormadapter.NewAdapter("postgres", dataSourceName)
	if err != nil {
		return nil, err
	}

	// Initialize Casbin enforcer with the model and adapter
	enforcer, err := casbin.NewEnforcer(m, adapter)
	if err != nil {
		return nil, err
	}

	err = enforcer.LoadPolicy()
	if err != nil {
		return nil, err
	}

	return &CasbinService{Enforcer: enforcer}, nil
}

// Enforce checks whether a user (sub) is allowed to perform an action (act) on an object (obj)
func (s *CasbinService) Enforce(sub, obj, act string) (bool, error) {
	return s.Enforcer.Enforce(sub, obj, act)
}

// AddPolicy adds a new policy to the Casbin model
func (s *CasbinService) AddPolicy(sub, obj, act string) (bool, error) {
	return s.Enforcer.AddPolicy(sub, obj, act)
}

// RemovePolicy removes a policy from the Casbin model
func (s *CasbinService) RemovePolicy(sub, obj, act string) (bool, error) {
	return s.Enforcer.RemovePolicy(sub, obj, act)
}

// ListPolicies lists all the current policies in the Casbin model
func (s *CasbinService) ListPolicies() ([][]string, error) {
	return s.Enforcer.GetPolicy()
}

// GetRoleForUsers list all current user role by user's Id in Casbin model
func (s *CasbinService) GetRoleForUsers(userId string) ([]string, error) {
	return s.Enforcer.GetRolesForUser(userId)
}

// GetAllRoles llst all role of casbin
func (s *CasbinService) GetAllRoles() ([]string, error) {
	return s.Enforcer.GetAllRoles()
}

// AddGroupingPolicy add user to group role policy
func (s *CasbinService) AddGroupingPolicy(userId uuid.UUID, role string) (bool, error) {
	return s.Enforcer.AddGroupingPolicy(userId, role)
}