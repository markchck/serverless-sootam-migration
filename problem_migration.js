const fs = require("fs")
const filePath = "/Users/jaeminki/Desktop/problem.json"
const AWS = require("aws-sdk")
const AWS_region = "ap-northeast-2"
AWS.config.update({ region: AWS_region })

async function extract() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (error, data) => {
      if (error) {
        console.error("파일 읽기 오류:", error)
        reject(error)
        return
      }
      resolve(data)
    })
  })
}

async function main() {
  try {
    const data = await extract()
    JSON.parse(data).forEach(async (element) => {
      try {
        const questionId = element.id || ""
        const year = element.date.slice(0, 4) || ""
        const month = element.date.slice(4, 6) || ""
        const copyright = element.copyright.split(" ")[0] || ""
        const testType = element.copyright.split(" ")[1] || ""
        const number = element.number.toString() || ""
        const successRate = element.corper.toString() || ""
        const questionImage = JSON.parse(element.image_data).id || ""
        const solutionImage = JSON.parse(element.solution_data).id || ""
        const answer = element.answer.toString() || ""

        const dynamoDb = new AWS.DynamoDB.DocumentClient()
        const putParams = {
          TableName: "sootam-dev",
          Item: {
            pk: "question",
            sk: `questionId#${questionId}`,
            year: year,
            month: month,
            number: number,
            successRate: successRate,
            questionImage: questionImage,
            solutionImage: solutionImage,
            answer: answer,
            testType: testType,
            copyright: copyright,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }
        const response = await dynamoDb.put(putParams).promise()
        return response
      } catch (error) {
        console.error("에러 발생:", error)
      }
    })
  } catch (error) {
    console.error("에러 발생:", error)
  }
}

main()
