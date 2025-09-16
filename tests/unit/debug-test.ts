import { parseIntent } from '../../src/lib/intent/parse'
import { SYNONYMS, FLAT_SYNONYMS } from '../../src/lib/intent/synonyms'

console.log('SYNONYMS:', SYNONYMS)
console.log('FLAT_SYNONYMS:', FLAT_SYNONYMS)

console.log('Parsing "free tools":', parseIntent('free tools'))
console.log('Parsing "writing tools":', parseIntent('writing tools'))