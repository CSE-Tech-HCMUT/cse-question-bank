package entity


type Tag struct {
	Id          int `gorm:"primaryKey"`
	Name        string
	Description string
	// TODO: Add table subject -> model subject
	Subject string
	Options     []Option `gorm:"foreignKey:TagID; constraint:OnDelete:CASCADE;"`
}
