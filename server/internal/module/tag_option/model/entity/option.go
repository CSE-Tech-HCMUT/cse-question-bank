package entity

type Option struct {
	Id    int    `gorm:"primaryKey" json"id"`
	Name  string `json:"name"`
	TagID int    `json:"tagId"`
}
