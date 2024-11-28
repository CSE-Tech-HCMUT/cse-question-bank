package entity

import "github.com/google/uuid"

type User struct {
	Id             uuid.UUID
	Mail           string
	Username       string
	Password       string
	Role           string
	DepartmentCode string      // Foreign key to Department
	Department     Department `gorm:"foreignKey:DepartmentCode"`
	Subjects       []Subject  `gorm:"many2many:subject_users"`
}
