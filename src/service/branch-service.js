import { prismaClient } from '../application/database.js';
import { ResponseError } from '../error/response-error.js';
import { createBranchValidation } from '../validation/branch-validation.js';
import { validate } from '../validation/validation.js';
import path from 'path';
import fs from 'fs';
