import { Col, Form, Row, Select } from "antd"
import { useState } from "react"

export const GeneralSettingTemplate = () => {
  const [form] = Form.useForm();

  const [ listOfDepartments, _setListOfDepartments ] = useState<string[]>([
    "Khoa khoa học và Kỹ thuật Máy tính",
    "Khoa Kỹ thuật Hóa học",
    "Khoa Điện - Điện tử"
  ])
  const [ listOfCourse, _setListOfCourse ] = useState<string[]>([
    "Cấu trúc dữ liệu và giải thuật",
    "Kỹ thuật lập trình",
    "Nguyên lý ngôn ngữ lập trình"
  ])
  const [ typeQuestion, _setTypeQuestion ] = useState<string[]>([
    "Single Question",
    "Block Question"
  ])
  const [ mainTag, _setMainTag ] = useState<string[]>([
    "Tag 1",
    "Tag 2"
  ])

  const optionListOfDepartments = listOfDepartments.map((deparment) => ({
    value: deparment,
    label: deparment
  }))
  const optionListOfCourse = listOfCourse.map((course) => ({
    value: course,
    label: course
  }))
  const optionTypeQuestion = typeQuestion.map((question) => ({
    value: question,
    label: question
  }))
  const optionMainTag = mainTag.map((tag) => ({
    value: tag,
    label: tag
  }))

  return (
    <>
      <h1 className="text-3xl font-semibold text-black mb-4 md:mb-8">General Setting</h1>

      <Form
        name="General Setting"
        layout="vertical"
        autoComplete="off"
        form={form}
      >
        <Row gutter={16}>
          <Col md={12} xs={24}>
            <Form.Item
              name="department"
              label={<span className="font-medium text-[16px]">Department</span>}
            >
              <Select 
                options={optionListOfDepartments}
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="course"
              label={<span className="font-medium text-[16px]">Course</span>}
            >
              <Select 
                options={optionListOfCourse}
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="typeQuestion"
              label={<span className="font-medium text-[16px]">Type Question</span>}
            >
              <Select 
                options={optionTypeQuestion}
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="mainTag"
              label={<span className="font-medium text-[16px]">Main Tag</span>}
            >
              <Select 
                options={optionMainTag}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default GeneralSettingTemplate