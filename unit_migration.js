const fs = require("fs")
const filePath = "/Users/jaeminki/Desktop/units.json"
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
        const unitId = element.id || ""
        const name = element.name || ""
        const chapter = element.chapter || ""

        const dynamoDb = new AWS.DynamoDB.DocumentClient()
        const putParams = {
          TableName: "sootam-dev",
          Item: {
            pk: "unit",
            sk: `unitId#${unitId}`,
            name: name,
            chapter: chapter,
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
