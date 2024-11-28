package entity

type Department struct {
	Code     string    `gorm:"type:varchar(50);primaryKey"`
	Name     string    `gorm:"type:varchar(100)"`
	Users    []User    `gorm:"foreignKey:DepartmentCode;constraint:OnDelete:CASCADE"` // Has-many Users
	Subjects []Subject `gorm:"foreignKey:DepartmentCode;constraint:OnDelete:CASCADE"` // Has-many Subjects
}
