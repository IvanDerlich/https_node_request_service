var https = require('https');

const service = async (city, page) => {
  return await new Promise((resolve, reject) => {
    var options = {
      host: 'jsonmock.hackerrank.com',
      path: '/api/food_outlets?city=' + city+ '&page=' + page,
      method: 'GET'
    };
    const req = https.request(options, res => {
      // console.log(`statusCode: ${res.statusCode}`);
      // reject on bad status
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode));      
      }
      // cumulate data
      var body = [];
      res.on('data', function(chunk) {
          body.push(chunk);
      });
      
      res.on('end', function() {
        try {
            body = JSON.parse(Buffer.concat(body).toString());
        } catch(e) {
            reject(e);
        }
        resolve(body);
      });      
    });
    // reject on request error
    req.on('error', function(err) {
      // This is not a "Second reject", just a different sort of failure
      reject(err);
    }); 
    
    req.end();
  })  
}

const main = async () => {
  let res = await service("Denver", 1)
  const { total_pages } = res
  console.log(total_pages)
  for(let i = 1; i <= total_pages;i++){
    console.log(i)
    res = await service("Denver", i)    
    console.log(res.data)
    console.log("----")
  }
}

main()
