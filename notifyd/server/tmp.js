function temp() {
    const simpleLogger = require('simple-node-logger'),
        opts = {
            logFilePath:'temp_logs.log',
            timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
        },
    log = simpleLogger.createSimpleLogger(opts);
    a = "aaa";
    b = "bbb";
    log.info("this is simple log !!! ","params : ","\na : ",a,"\nb : ",b);
}
temp();