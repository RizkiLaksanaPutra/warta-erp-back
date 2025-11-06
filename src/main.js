import { web } from "./application/web.js";
import { logger } from "./application/logging.js";

const port = 5005

web.listen(port, () => {
    logger.info(`App start at port: ${port}`)
})