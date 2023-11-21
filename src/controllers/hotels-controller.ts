import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelService } from '@/services';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const hotels = await hotelService.getHotels(userId);
  res.status(httpStatus.OK).send(hotels);
}

export async function getHotelsRooms(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId);

  const getHotelsWithRooms = await hotelService.getHotelsWithRooms(userId, hotelId);
  res.status(httpStatus.OK).send(getHotelsWithRooms);
}
