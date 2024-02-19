// import * as winston from 'winston';
// import 'winston-daily-rotate-file';

// const logDir = `./logs`;
// const { combine, timestamp, label, printf } = winston.format;

// const logFormat = printf(({ level, message, label, timestamp }) => {
//   return `${timestamp} [${label}] ${level}: ${message}`;
// });

// function setTransport(level: string) {
//   return new winston.transports.DailyRotateFile({
//     level: level,
//     datePattern: 'YYYY-MM-DD',
//     dirname: logDir,
//     filename: `%DATE%.${level}.log`,
//     maxFiles: '30',
//     maxSize: '20m',
//     zippedArchive: true,
//   });
// }

// export const logger = winston.createLogger({
//   format: combine(
//     label({
//       label: 'STARTER',
//     }),
//     timestamp({
//       format: 'YYYY-MM-DD HH:mm:ss',
//     }),
//     logFormat,
//   ),
//   transports: [setTransport('info'), setTransport('error')],
//   exceptionHandlers: [setTransport('exception')],
// });

// logger.add(
//   new winston.transports.Console({
//     // level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
//     format: winston.format.combine(
//       winston.format.colorize(),
//       winston.format.simple(),
//     ),
//   }),
// );
