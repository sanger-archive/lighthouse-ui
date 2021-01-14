// this is done as lowest common demoninator to get it working
// nothing fancy, no error checking
// it will take a file, read it and return it
// TODO: add some error handling
const read = async (file) => {
  const reader = new FileReader()

  const promise = new Promise((resolve, reject) => {
    reader.onload = () => {
      const result = reader.result
      resolve(result)
    }
    reader.readAsText(file)
  })

  // the promise is in essence a file stream
  return await promise
}

const parse = (data) => {
  // split data into rows
  const rows = data.split(/\r?\n/)

  // headers are on the first row remove it and turn into an array of headers
  const headers = rows.shift().split(',')

  // return a json object which will be an array of records
  return rows.map((row) => {
    // each record is turned into an object
    // with each item with a key of its header
    return row.split(',').reduce((record, item, index) => {
      record[headers[index]] = item
      return record
    }, {})
  })
}

const CSV = {
  read,
  parse
}

export default CSV
