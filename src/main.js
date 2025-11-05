import { web } from "./application/web.js";
import { logger } from "./application/logging.js";

web.listen(5005, () => {
    logger.info('App start')
})