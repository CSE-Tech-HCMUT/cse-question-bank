package casbin

import (
	"cse-question-bank/internal/database/entity"
	"fmt"

	"gorm.io/gorm"
)

func InitCasbinPolicy(casbin *CasbinService, db *gorm.DB) error {
	if err := casbinInitDepartmentManager(casbin, db); err != nil {
		return err
	}
	if err := casbinInitTeacherRole(casbin, db); err != nil {
		return err
	}	
	if err := casbinInitSubjectManager(casbin, db); err != nil {
		return err
	}

	return nil
}

func casbinInitDepartmentManager(casbin *CasbinService, db *gorm.DB) error {
	var departments []entity.Department
	if err := db.Find(&departments).Error; err != nil {
		return fmt.Errorf("failed to fetch departments: %v", err)
	}

	for _, department := range departments {
		role := fmt.Sprintf("department_manager:%s", department.Code)
		departmentCode := fmt.Sprintf("department:%s", department.Code)

		if _, err := casbin.AddPolicy(role, departmentCode, "POST"); err != nil {
			return err
		}
		if _, err := casbin.AddPolicy(role, departmentCode, "GET"); err != nil {
			return err
		}
		if _, err := casbin.AddPolicy(role, departmentCode, "PUT"); err != nil {
			return err
		}
	}

	return nil
}

func casbinInitSubjectManager(casbin *CasbinService, db *gorm.DB) error {
	var subjects []entity.Subject
	if err := db.Find(&subjects).Error; err != nil {
		return fmt.Errorf("failed to fetch subjects: %v", err)
	}

	for _, subject := range subjects {
		role := fmt.Sprintf("subject_manager:%d", subject.Id)
		subjectId := fmt.Sprintf("subject:%d", subject.Id)

		if _, err := casbin.AddPolicy(role, subjectId, "POST"); err != nil {
			return err
		}
		if _, err := casbin.AddPolicy(role, subjectId, "GET"); err != nil {
			return err
		}
		if _, err := casbin.AddPolicy(role, subjectId, "PUT"); err != nil {
			return err
		}

		// department manager grant all subject manager policy
		departmentRole := fmt.Sprintf("department_manager:%s", subject.DepartmentCode)
		if _, err := casbin.AddGroupingPolicy(role, departmentRole); err != nil {
			return err
		}
	}

	return nil
}

func casbinInitTeacherRole(casbin *CasbinService, db *gorm.DB) error {
	var subjects []entity.Subject
	if err := db.Find(&subjects).Error; err != nil {
		return fmt.Errorf("failed to fetch subjects: %v", err)
	}

	for _, subject := range subjects {
		role := fmt.Sprintf("teacher:%d", subject.Id)

		subjectObj := fmt.Sprintf("subject:%d", subject.Id)
		if _, err := casbin.AddPolicy(role, subjectObj, "GET"); err != nil {
			return fmt.Errorf("failed to add policy for subject GET: %v", err)
		}

		if _, err := casbin.AddPolicy(role, "question", "GET"); err != nil {
			return fmt.Errorf("failed to add GET policy for question: %v", err)
		}
		if _, err := casbin.AddPolicy(role, "question", "POST"); err != nil {
			return fmt.Errorf("failed to add POST policy for question: %v", err)
		}
		if _, err := casbin.AddPolicy(role, "question", "PUT"); err != nil {
			return fmt.Errorf("failed to add PUT policy for question: %v", err)
		}
		if _, err := casbin.AddPolicy(role, "question", "DELETE"); err != nil {
			return fmt.Errorf("failed to add DELETE policy for question: %v", err)
		}
	}

	return nil
}

func casbinInitQuestionGroups(casbin *CasbinService, db *gorm.DB) error {
	var questions []entity.Question
	if err := db.Find(&questions).Error; err != nil {
		return fmt.Errorf("failed to fetch questions: %v", err)
	}

	for _, question := range questions {
		if question.SubjectId == nil {
			continue
		}

		questionObj := fmt.Sprintf("question:%d", question.Id)
		subjectObj := fmt.Sprintf("subject:%d", *question.SubjectId)

		if _, err := casbin.AddQuestionToSubjectGroup(questionObj, subjectObj); err != nil {
			return fmt.Errorf("failed to add g2 policy: %v", err)
		}
	}

	return nil
}