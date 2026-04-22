
import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';


describe('RESTful API - Objects', () => {
	const p = pactum;
	const baseUrl = 'https://api.restful-api.dev/objects';

	let createdId: string;

	// GET all objects - positive
	it('GET /objects - should return 200 and array', async () => {
		await p
			.spec()
			.get(baseUrl)
			.expectStatus(StatusCodes.OK)
			.expectStatus(StatusCodes.OK);
	});

	// POST create object - positive
	it('POST /objects - should create object and return 200', async () => {
		const res = await p
			.spec()
			.post(baseUrl)
			.withJson({ name: 'Test Object', data: { foo: 'bar' } })
			.expectStatus(StatusCodes.OK)
			.returns('id');
		createdId = res;
	});


	// GET object by id - positive
	it('GET /objects/{id} - should return created object', async () => {
		await p
			.spec()
			.get(`${baseUrl}/${createdId}`)
			.expectStatus(StatusCodes.OK)
			.expectJsonLike({ id: createdId, name: 'Test Object' });
	});

	// GET object by id - negative (invalid id)
	it('GET /objects/{id} - invalid id should return 404', async () => {
		await p
			.spec()
			.get(`${baseUrl}/invalid-id-123456`)
			.expectStatus(StatusCodes.NOT_FOUND);
	});

	// PUT update object - positive
	it('PUT /objects/{id} - should update object', async () => {
		await p
			.spec()
			.put(`${baseUrl}/${createdId}`)
			.withJson({ name: 'Updated Object', data: { foo: 'baz' } })
			.expectStatus(StatusCodes.OK)
			.expectJsonLike({ name: 'Updated Object', data: { foo: 'baz' } });
	});

	// PUT update object - negative (invalid id)
	it('PUT /objects/{id} - invalid id should return 404', async () => {
		await p
			.spec()
			.put(`${baseUrl}/invalid-id-123456`)
			.withJson({ name: 'Should Fail' })
			.expectStatus(StatusCodes.NOT_FOUND);
	});

	// DELETE object - positive
	it('DELETE /objects/{id} - should delete object', async () => {
		await p
			.spec()
			.delete(`${baseUrl}/${createdId}`)
			.expectStatus(StatusCodes.OK);
	});

	// DELETE object - negative (already deleted)
	it('DELETE /objects/{id} - already deleted should return 404', async () => {
		await p
			.spec()
			.delete(`${baseUrl}/${createdId}`)
			.expectStatus(StatusCodes.NOT_FOUND);
	});
});
