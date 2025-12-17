/**
 * Utility function to parse request body
 * Since we're not using Express, we need to manually parse the body
 */
export function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        if (!body || !body.trim()) {
          resolve({});
          return;
        }
        
        const rawContentType = req.headers['content-type'] || '';
        const contentType = rawContentType.split(';')[0].trim();

        if (contentType.includes('application/json')) {
          resolve(JSON.parse(body));
          return;
        }

        if (contentType.includes('application/x-www-form-urlencoded')) {
          const params = new URLSearchParams(body);
          const data = {};
          params.forEach((value, key) => {
            data[key] = value;
          });
          resolve(data);
          return;
        }

        resolve({});
      } catch (error) {
        // Mark parse issues so controllers can respond with 400 instead of 500
        error.statusCode = 400;
        reject(error);
      }
    });
    
    req.on('error', (error) => {
      reject(error);
    });
  });
}

