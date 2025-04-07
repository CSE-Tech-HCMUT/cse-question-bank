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
	
	[role_definition]
	g = _, _ 

	[policy_effect]
	e = some(where (p.eft == allow))

	[matchers]
	m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
	`)
	if err != nil {
		return nil, err
	}

	var (
		password = os.Getenv("DB_PASSWORD")
		username = os.Getenv("DB_USERNAME")
		port     = os.Getenv("DB_PORT")
		host     = os.Getenv("DB_HOST")
		database = os.Getenv("DB_DATABASE")
	)

	// Use the Gorm adapter for storing policies
	dataSourceName := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, username, password, database)
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
func (s *CasbinService) AddUserRole(userId uuid.UUID, role string) (bool, error) {
	return s.Enforcer.AddGroupingPolicy(userId, role)
}

// AddGroupingPolicy add user to group role policy
func (s *CasbinService) AddGroupingPolicy(role1, role2 string) (bool, error) {
	return s.Enforcer.AddGroupingPolicy(role1, role2)
}

// add question to subject id for manage
func (s *CasbinService) AddQuestionToSubjectGroup(questionObj, subjectObj string) (bool, error) {
	return s.Enforcer.AddNamedGroupingPolicy("g2", questionObj, subjectObj)
}

func (s *CasbinService) LoadPolicy() error {
	return s.Enforcer.LoadPolicy()
}

// GetGroupingPolicy lists all grouping policie
func (s *CasbinService) GetGroupingPolicy() ([][]string, error) {
	return s.Enforcer.GetGroupingPolicy()
}

// remove all policy relate to object
func (s *CasbinService) RemovePolicyByObject(object string) (bool, error) {
	return s.Enforcer.RemoveFilteredPolicy(1, object)
}
