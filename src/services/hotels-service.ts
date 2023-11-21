import { TicketStatus } from '@prisma/client';
import { invalidDataError, notFoundError } from '@/errors';
import { cannotListHotelsError } from '@/errors/cannot-list-hotel-error';
import { enrollmentRepository, hotelRepository, ticketsRepository } from '@/repositories';

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const tickets = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!tickets) throw notFoundError();

  const type = tickets.ticketType;
  if (tickets.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) throw cannotListHotelsError();

  const hotels = await hotelRepository.findHotels();
  if (hotels.length === 0) throw notFoundError();

  return hotels;
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const tickets = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!tickets) throw notFoundError();

  const type = tickets.ticketType;
  if (tickets.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) throw cannotListHotelsError();
  if (!hotelId || isNaN(hotelId)) throw invalidDataError('hotelId');

  const hotelWithRooms = await hotelRepository.findRoomsByHotelId(hotelId);
  if (!hotelWithRooms) throw notFoundError();

  return hotelWithRooms;
}

export const hotelService = {
  getHotels,
  getHotelsWithRooms,
};
