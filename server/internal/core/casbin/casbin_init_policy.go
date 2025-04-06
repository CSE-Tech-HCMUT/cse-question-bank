package casbin

import (
	"cse-question-bank/internal/database/entity"
	"fmt"

	"gorm.io/gorm"
)

const (
	GET_ONLY          = "get-only"
	MANAGE_DEPARTMENT = "manage_department"
	MANAGE_SUBJECT    = "manage_subject"
	MANAGE_TAG        = "manage_tag"
	MANAGE_QUESTION   = "manage_question"
	MANAGE_EXAM       = "manage_exam"
)

func InitCasbinPolicy(casbin *CasbinService, db *gorm.DB) error {
	if err := casbinInitDepartment(casbin, db); err != nil {
		return err
	}
	// if err := casbinInitTeacherRole(casbin, db); err != nil {
	// 	return err
	// }
	if err := casbinInitSubject(casbin, db); err != nil {
		return err
	}

	return nil
}

func casbinInitDepartment(casbin *CasbinService, db *gorm.DB) error {
	var departments []entity.Department
	if err := db.Find(&departments).Error; err != nil {
		return fmt.Errorf("failed to fetch departments: %v", err)
	}

	for _, department := range departments {
		managerRole := fmt.Sprintf("department_manager:%s", department.Code)
		departmentCode := fmt.Sprintf("department:%s", department.Code)

		if _, err := casbin.AddPolicy(managerRole, departmentCode, MANAGE_DEPARTMENT); err != nil {
			return err
		}

		if _, err := casbin.AddPolicy(managerRole, departmentCode, GET_ONLY); err != nil {
			return err
		}

		teacherRole := fmt.Sprintf("teacher_department:%s", department.Code)
		if _, err := casbin.AddPolicy(teacherRole, departmentCode, GET_ONLY); err != nil {
			return err
		}
	}

	return nil
}

func casbinInitSubject(casbin *CasbinService, db *gorm.DB) error {
	var subjects []entity.Subject
	if err := db.Find(&subjects).Error; err != nil {
		return fmt.Errorf("failed to fetch subjects: %v", err)
	}

	for _, subject := range subjects {
		managerRole := fmt.Sprintf("subject_manager:%s", subject.Id.String())
		subjectId := fmt.Sprintf("subject:%s", subject.Id.String())

		if _, err := casbin.AddPolicy(managerRole, subjectId, MANAGE_SUBJECT); err != nil {
			return err
		}
		if _, err := casbin.AddPolicy(managerRole, subjectId, GET_ONLY); err != nil {
			return err
		}
		if _, err := casbin.AddPolicy(managerRole, subjectId, MANAGE_TAG); err != nil {
			return err
		}

		teacherRole := fmt.Sprintf("teacher_subject:%s", subject.Id.String())
		if _, err := casbin.AddPolicy(teacherRole, subjectId, GET_ONLY); err != nil {
			return err
		}
		if _, err := casbin.AddPolicy(teacherRole, subjectId, MANAGE_QUESTION); err != nil {
			return err
		}
		if _, err := casbin.AddPolicy(teacherRole, subjectId, MANAGE_EXAM); err != nil {
			return err
		}

		// department manager grant all subject manager policy
		// departmentRole := fmt.Sprintf("department_manager:%s", subject.DepartmentCode)
		// if _, err := casbin.AddGroupingPolicy(role, departmentRole); err != nil {
		// 	return err
		// }
	}

	return nil
}

// func casbinInitTeacherRole(casbin *CasbinService, db *gorm.DB) error {
// 	var subjects []entity.Subject
// 	if err := db.Find(&subjects).Error; err != nil {
// 		return fmt.Errorf("failed to fetch subjects: %v", err)
// 	}

// 	for _, subject := range subjects {
// 		role := fmt.Sprintf("teacher:%s", subject.Id.String())

// 		subjectObj := fmt.Sprintf("subject:%s", subject.Id.String())
// 		if _, err := casbin.AddPolicy(role, subjectObj, "GET"); err != nil {
// 			return fmt.Errorf("failed to add policy for subject GET: %v", err)
// 		}

// 		if _, err := casbin.AddPolicy(role, "question", "GET"); err != nil {
// 			return fmt.Errorf("failed to add GET policy for question: %v", err)
// 		}
// 		if _, err := casbin.AddPolicy(role, "question", "POST"); err != nil {
// 			return fmt.Errorf("failed to add POST policy for question: %v", err)
// 		}
// 		if _, err := casbin.AddPolicy(role, "question", "PUT"); err != nil {
// 			return fmt.Errorf("failed to add PUT policy for question: %v", err)
// 		}
// 		if _, err := casbin.AddPolicy(role, "question", "DELETE"); err != nil {
// 			return fmt.Errorf("failed to add DELETE policy for question: %v", err)
// 		}
// 	}

// 	return nil
// }

// func casbinInitQuestionGroups(casbin *CasbinService, db *gorm.DB) error {
// 	var questions []entity.Question
// 	if err := db.Find(&questions).Error; err != nil {
// 		return fmt.Errorf("failed to fetch questions: %v", err)
// 	}

// 	for _, question := range questions {
// 		if question.SubjectId == nil {
// 			continue
// 		}

// 		questionObj := fmt.Sprintf("question:%s", question.Id.String())
// 		subjectObj := fmt.Sprintf("subject:%s", question.SubjectId.String())

// 		if _, err := casbin.AddQuestionToSubjectGroup(questionObj, subjectObj); err != nil {
// 			return fmt.Errorf("failed to add g2 policy: %v", err)
// 		}
// 	}

// 	return nil
// }
