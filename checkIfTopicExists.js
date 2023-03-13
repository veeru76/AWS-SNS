module.exports = (AWS, topicName) => {
    return new Promise((resolve, reject) => {
      try {
        const listTopics = new AWS.SNS({ apiVersion: "2010-03-31" })
          .listTopics({})
          .promise()
        listTopics
          .then(data => {
            if (data.Topics.includes(topicName)) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
          .catch(err => {
            throw err
          })
      } catch (e) {
        reject(e)
      }
    })
  }