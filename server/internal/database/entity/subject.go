package entity

import "github.com/google/uuid"

type Subject struct {
	Id             uuid.UUID	`gorm:"type:uuid;primaryKey"`
	Name           string
	Code           string	`gorm:"uniqueIndex"`
	DepartmentCode string
	Department     Department `gorm:"foreignKey:DepartmentCode"`
	Users          []User     `gorm:"many2many:subject_users"`
	Questions      []Question `gorm:"foreignKey:SubjectId;constraint:OnDelete:CASCADE"`
	Tags           []Tag      `gorm:"foreignKey:SubjectId;constraint:OnDelete:CASCADE"`
}
