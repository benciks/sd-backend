import 'source-map-support/register'
require('reflect-metadata')
require('dotenv').config()

import app from './index'
app()
    .then()
    .catch((e) => console.error(e))
