import { Col, Form, Row, Select } from "antd"
import { useState } from "react"
import { SubTag } from "../../types/tag/tad";

export const QuestionSettingTemplate = () => {
  const [form] = Form.useForm();

  const [ listOfSubTags, _setListOfSubTags ] = useState<SubTag[]>([
    {
      id: "1",
      name: "Difficult",
      description: "Độ khó của môn học",
      option: [
        "Hard", "Normal", "Easy"
      ],
      date: "11/07/2024",
    },
    {
      id: "2",
      name: "Level",
      description: "Mức đọ của môn học",
      option: [
        "Thông hiểu", "Vận dụng"
      ],
      date: "11/07/2024",
    }
  ])

  const createOptionOfTag = (id: string) => { 
    const subTagSelected = listOfSubTags.find((subTag) => subTag.id === id)

    if (subTagSelected) {
      return subTagSelected.option.map((option) => (
        <Select.Option key={option} value={option}>{option}</Select.Option>
      ))
    }
  }

  return (
    <>
      <h1 className="text-3xl font-semibold text-black mb-4 md:mb-8">Question Setting</h1>

      <Form
        name="General Setting"
        layout="vertical"
        autoComplete="off"
        form={form}
      >
        <Row gutter={16}>
          {
            listOfSubTags.map((subTag) => (
              <Col key={subTag.id} xs={24} md={12}>
                <Form.Item
                  name={`subTag.${subTag.id}.name`}
                  label={<span className="font-medium text-[16px]">{subTag.name}</span>}
                >
                  <Select>
                    {
                      createOptionOfTag(subTag.id)
                    }
                  </Select>
                </Form.Item>
              </Col>
            ))
          }
          
        </Row>
      </Form>
    </>
  )
}

export default QuestionSettingTemplate