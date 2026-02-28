import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { HttpExceptionFilter } from '../../src/presentation/filters/http-exception.filter';

describe('ParkingController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/parking/check-in (POST)', () => {
    it('should create a check-in successfully', () => {
      return request(app.getHttpServer())
        .post('/api/parking/check-in')
        .send({
          licensePlate: 'ABC1234',
          model: 'Test Car',
          color: 'Blue',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('ticketCode');
          expect(res.body).toHaveProperty('licensePlate', 'ABC1234');
          expect(res.body).toHaveProperty('spotNumber');
          expect(res.body).toHaveProperty('checkInTime');
        });
    });

    it('should return 400 for invalid license plate', () => {
      return request(app.getHttpServer())
        .post('/api/parking/check-in')
        .send({
          licensePlate: '123',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('error', 'Business Error');
        });
    });
  });

  describe('/api/parking/check-out (POST)', () => {
    it('should create a check-out successfully', async () => {
      // First create a check-in
      const checkInResponse = await request(app.getHttpServer())
        .post('/api/parking/check-in')
        .send({ licensePlate: 'XYZ5678' });

      const ticketCode = checkInResponse.body.ticketCode;

      // Then check-out
      return request(app.getHttpServer())
        .post('/api/parking/check-out')
        .send({ ticketCodeOrPlate: ticketCode })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('ticketCode', ticketCode);
          expect(res.body).toHaveProperty('checkOutTime');
          expect(res.body).toHaveProperty('totalAmount');
        });
    });

    it('should return 404 for non-existent ticket', () => {
      return request(app.getHttpServer())
        .post('/api/parking/check-out')
        .send({ ticketCodeOrPlate: 'INVALID' })
        .expect(404);
    });
  });

  describe('/api/parking/spots/available (GET)', () => {
    it('should return available spots', () => {
      return request(app.getHttpServer())
        .get('/api/parking/spots/available')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});