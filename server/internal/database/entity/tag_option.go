package entity

type Option struct {
	Id    int `gorm:"primaryKey"`
	Name  string
	TagID int
}
