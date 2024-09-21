import { Flex, Spin } from "antd"

export const Loading = () => {
  return (
    <>
      <Flex align="center" gap="middle" className="w-full h-[400px] flex justify-center items-center">
        <Spin size="large" />
      </Flex>
    </>
  )
}

export default Loading