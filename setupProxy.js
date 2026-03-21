const{createProxyMiddleware}= require('http-proxy-middleware')
module.exports= function(app){
 app.use(
  '/api',//adjust the path you want to proxy
  createProxyMiddleware({
   target:'http://localhost:8000',//specify the address of your backend server
   changeOrigin:true,
   secure:false,//set the false if your backend doesn't use HTTPS
 
  })
 )

}