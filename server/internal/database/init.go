package database

import (
	"cse-question-bank/internal/database/entity"

	"gorm.io/gorm"
)

func InitData(db *gorm.DB) error {
	initDepartmentData(db)
	initSubjectData(db)

	return nil
} 

func initDepartmentData(db *gorm.DB) error {
	departments := []entity.Department{
		{Code: "CSE", Name: "Khoa khoa học và Kỹ thuật Máy tính"},
		{Code: "1", Name: "Khoa Điện - Điện tử"},
		{Code: "2", Name: "Khoa Kỹ thuật xây dựng"},
		{Code: "3", Name: "Khoa Cơ khý"},
		{Code: "4", Name: "Khoa Kỹ thuật Hóa học"},
		{Code: "5", Name: "Khoa Công nghệ Vật liệu"},
		{Code: "6", Name: "Khoa Khoa học Ứng dụng"},
		{Code: "7", Name: "Khoa Kỹ thuật giao thông"},
		{Code: "8", Name: "Khoa Quản lý Công nghiệp"},
		{Code: "9", Name: "Khoa Kỹ thuật Địa chất và Dầu khí"},
		{Code: "10", Name: "Khoa Môi trường và Tài nguyên"},
		{Code: "11", Name: "Trung tâm Đào tạo Bảo dưỡng Công nghiệp"},
	}

	if err := db.Create(&departments).Error; err != nil {
		return err
	}

	return nil
}

func initSubjectData(db *gorm.DB) error {
	subjects := []entity.Subject{
		{Name: "Cấu trúc dữ liệu và Giải thuật", Code: "DSA", DepartmentCode: "CSE"},
		{Name: "Kỹ thuật lập trình", Code: "KTLT", DepartmentCode: "CSE"},
		{Name: "Nhập môn điện toán", Code: "NMDT", DepartmentCode: "CSE"},
		{Name: "Nguyên lý ngôn ngữ lập trình", Code: "PPL", DepartmentCode: "CSE"},
	}

	if err := db.Create(&subjects).Error; err != nil {
		return err
	}

	return nil
}