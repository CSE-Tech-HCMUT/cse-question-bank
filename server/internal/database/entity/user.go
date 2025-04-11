package entity

import (
	"cse-question-bank/internal/util"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	Id             uuid.UUID
	Mail           string
	Username       string
	Password       string
	Role           Role
	DepartmentCode string     // Foreign key to Department
	Department     Department `gorm:"foreignKey:DepartmentCode"`
	Subjects       []Subject  `gorm:"many2many:subject_users"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.Id == uuid.Nil {
		u.Id, err = util.GenerateUUID()
	}
	return
}
