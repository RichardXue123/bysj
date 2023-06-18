const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    proxy:{
      'api/statistics':{
        target: 'http://106.15.51.165:3000/'
      }
    }
  }
})


// module.exports = { configureWebpack: {
//     resolve: {
//       extensions: [".ts", ".tsx", ".js", ".json"],  
//       alias: {}
//     },
//     module: {        
//       rules: [    
//         {    
//           test: /\.tsx?$/,    
//           loader: 'ts-loader',    
//           exclude: /node_modules/,    
//           options: {
//             appendTsSuffixTo: [/\.vue$/],    
//           }    
//         }        
//       ]    
//     }    
//   }
// }