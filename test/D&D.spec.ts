import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('D&D 5e API', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://dnd-combat-api-7f3660dcecb1.herokuapp.com/api';

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  // Sample character for testing
  const sampleCharacter = {
    name: 'TestHero',
    hitPoints: 50,
    armorClass: 15,
    strength: 16,
    dexterity: 14,
    constitution: 15,
    intelligence: 12,
    wisdom: 13,
    charisma: 10
  };

  // Test GET /api/characters/example
  describe('GET /api/characters/example', () => {
    it('Should return a template example character with status 200', async () => {
      await p
        .spec()
        .get(`${baseUrl}/characters/example`)
        .expectStatus(StatusCodes.OK);
    });
  });

  // Test POST /api/characters/check
  describe('POST /api/characters/check', () => {
    it('Should validate a valid character and return 200', async () => {
      await p
        .spec()
        .post(`${baseUrl}/characters/check`)
        .withBody(sampleCharacter)
        .expectStatus(StatusCodes.OK);
    });

    it('Should return 400 for invalid character data', async () => {
      await p
        .spec()
        .post(`${baseUrl}/characters/check`)
        .withBody({ name: 'Invalid' })
        .expectStatus(StatusCodes.BAD_REQUEST);
    });
  });

  // Test GET /api/monsters/names/{page}
  describe('GET /api/monsters/names/{page}', () => {
    it('Should return monster names for page 1 with status 200', async () => {
      await p
        .spec()
        .get(`${baseUrl}/monsters/names/1`)
        .expectStatus(StatusCodes.OK);
    });

    it('Should return monster names for page 32 (middle range)', async () => {
      await p
        .spec()
        .get(`${baseUrl}/monsters/names/32`)
        .expectStatus(StatusCodes.OK);
    });

    it('Should return monster names for page 65 (last page)', async () => {
      await p
        .spec()
        .get(`${baseUrl}/monsters/names/65`)
        .expectStatus(StatusCodes.OK);
    });

    it('Should return 500 for invalid page number', async () => {
      await p
        .spec()
        .get(`${baseUrl}/monsters/names/999`)
        .expectStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  // Test GET /api/monsters/{name}
  describe('GET /api/monsters/{name}', () => {
    it('Should return details for a specific monster', async () => {
      await p
        .spec()
        .get(`${baseUrl}/monsters/goblin`)
        .expectStatus(StatusCodes.OK);
    });

    it('Should return 500 for non-existent monster', async () => {
      await p
        .spec()
        .get(`${baseUrl}/monsters/nonexistent-monster-xyz`)
        .expectStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  // Test POST /api/battle/{monster}
  describe('POST /api/battle/{monster}', () => {
    it('Should simulate a battle between character and monster', async () => {
      await p
        .spec()
        .post(`${baseUrl}/battle/goblin`)
        .withBody(sampleCharacter)
        .expectStatus(StatusCodes.OK);
    });

    it('Should return 400 without character data', async () => {
      await p
        .spec()
        .post(`${baseUrl}/battle/goblin`)
        .expectStatus(StatusCodes.BAD_REQUEST);
    });

    it('Should return 500 for non-existent monster battle', async () => {
      await p
        .spec()
        .post(`${baseUrl}/battle/nonexistent-monster`)
        .withBody(sampleCharacter)
        .expectStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });
});
