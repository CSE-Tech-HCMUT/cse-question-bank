import { List, Card, Typography, Row, Col, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
const { Text, Paragraph } = Typography

interface SearchBarProps {
  onSearch: (value: string) => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = 'Search...' }) => {
  return (
    <Input
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      onChange={(e) => onSearch(e.target.value)}
      style={{ marginBottom: 16 }}
    />
  )
}

interface Question {
  id: number
  content: string
  subject: string
  topics: string[]
  author: string
  createdAt: Date
}

interface QuestionListProps {
  questions: Question[]
}

const QuestionList: React.FC<QuestionListProps> = ({ questions }) => {
  const truncateContent = (content: string, wordCount: number) => {
    const words = content.split(' ')
    if (words.length > wordCount) {
      return words.slice(0, wordCount).join(' ') + '...'
    }
    return content
  }

  return (
    <>
      <List
        // grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
        dataSource={questions}
        renderItem={(question) => (
          <List.Item style={{ width: '300px', flex: 'none', marginRight: '16px' }}>
            <Card
              hoverable
              style={{ width: '100%', height: '100%' }}
              title={
                <Row justify='space-between' align='middle'>
                  <Col>
                    <Text strong>{question.subject}</Text>
                  </Col>
                  <Col>
                    <Text type='secondary' style={{ fontSize: '0.9em' }}>
                      {question.createdAt.toDateString()}
                    </Text>
                  </Col>
                </Row>
              }
            >
              <Paragraph ellipsis={{ rows: 3 }}>{truncateContent(question.content, 20)}</Paragraph>
              <Row gutter={[0, 8]}>
                <Col span={24}>
                  <Text type='secondary'>Topics: </Text>
                  {question.topics.map((topic, index) => (
                    <Text key={index} style={{ marginRight: 8 }}>
                      {topic}
                      {index < question.topics.length - 1 ? ',' : ''}
                    </Text>
                  ))}
                </Col>
                <Col span={24}>
                  <Text type='secondary'>Author: </Text>
                  <Text>{question.author}</Text>
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />
    </>
  )
}

const QuestionBankTemplate = () => {
  const mockQuestions = [
    {
      id: 1,
      content:
        'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently update the view when data changes.',
      subject: 'Web Development',
      topics: ['React', 'JavaScript', 'Frontend'],
      author: 'John Doe',
      createdAt: new Date('2024-09-15')
    },
    {
      id: 2,
      content:
        'TypeScript interfaces are a powerful way to define the shape of an object. They allow you to specify which properties and methods an object should have, providing better type checking and code completion.',
      subject: 'Programming',
      topics: ['TypeScript', 'Interfaces', 'Object-Oriented Programming'],
      author: 'Jane Smith',
      createdAt: new Date('2024-09-16')
    }
  ]
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredQuestions, setFilteredQuestions] = useState(mockQuestions)
  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }
  useEffect(() => {
    const filtered = mockQuestions.filter(
      (question) =>
        question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.topics.some((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredQuestions(filtered)
  }, [searchTerm, mockQuestions])
  return (
    <div>
      <h1>Question Bank</h1>
      <SearchBar onSearch={handleSearch} placeholder='Search questions...' />
      <QuestionList questions={filteredQuestions} />
    </div>
  )
}

export default QuestionBankTemplate
