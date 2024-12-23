package entity

type Role string

var (
	Admin            Role = "admin"
	DepartmentManger Role = "department-manager"
	SubjectManger    Role = "subject-manager"
	Teacher          Role = "teacher"
)
