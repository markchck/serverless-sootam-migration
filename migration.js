const fs = require("fs")
const filePath = "/Users/jaeminki/Desktop/problem.json"
const AWS = require("aws-sdk")
const AWS_region = "ap-northeast-2"
AWS.config.update({ region: AWS_region })

async function putDB() {
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient()
    const putParams = {
      TableName: "math_platform_development",
      Item: {
        pk: "hi",
        sk: "hello",
      },
    }
    const response = await dynamoDb.put(putParams).promise()
    return response
  } catch (error) {
    console.error("에러 발생:", error)
  }
}

// async function extract() {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, "utf-8", (error, data) => {
//       if (error) {
//         console.error("파일 읽기 오류:", error)
//         reject(error)
//         return
//       }
//       resolve(data)
//     })
//   })
// }

// async function main() {
//   try {
//     const data = await extract()
//     console.log(data)
//   } catch (error) {
//     console.error("에러 발생:", error)
//   }
// }

// main()
putDB()
