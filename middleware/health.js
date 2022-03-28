export default {
    path: '/health',
    handler(req, res) {
      res.end('Lighthouse-ui is healthy!')
    }
}
