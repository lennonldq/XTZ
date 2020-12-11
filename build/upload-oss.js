const WebpackAliyunOss = require('webpack-aliyun-oss');
console.log(WebpackAliyunOss)


new WebpackAliyunOss({
    from: ['./dist/**'], // 上传那个文件或文件夹  可以是字符串或数组
    dist: "/", // 需要上传到oss上的给定文件目录
    region: "oss-cn-guangzhou",
    accessKeyId: "LTAI4G6THyaEAaykVrBAYuEh",
    accessKeySecret: "g9bZd0NPnlcRsL8gTAxun3ZjOuEjiZ",
    bucket: "profession",
    deleteEmptyDir: true,

    // test: true,   
    //上面一行，可以在进行测试看上传路径是否正确, 打开后只会显示上传路径并不会真正上传;

    // 因为文件标识符 "\"  和 "/" 的区别 不进行 setOssPath配置,上传的文件夹就会拼到文件名上, 丢失了文件目录,所以需要对setOssPath 配置。
    setOssPath: filePath => {
        // some operations to filePath
        let index = filePath.lastIndexOf("dist");
        let Path = filePath.substring(index + 4, filePath.length);
        return Path.replace(/\\/g, "/");
    },
    setHeaders: filePath => {
        return {
            "Cache-Control": "max-age=31536000"
        };
    }
}).apply();


