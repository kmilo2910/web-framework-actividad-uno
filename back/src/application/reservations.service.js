import { NotFoundError, ValidationError } from '../domain/errors.js';
export class ReservationsService {
  constructor(reservationRepository, spaceRepository, userRepository) {
    this.reservationRepository = reservationRepository;
    this.spaceRepository = spaceRepository;
    this.userRepository = userRepository;
  }
  async reserve({
    userEmail,
    spaceId,
    durationMinutes = 60,
    reservationDate,
    reservationTime = '08:00',
  }) {
    const user = await this.userRepository.findByEmail(userEmail);
    const space = await this.spaceRepository.findById(spaceId);
    if (!user) throw new NotFoundError('Usuario no encontrado');
    if (!space) throw new NotFoundError('Espacio no encontrado');
    if (space.status !== 'available') throw new ValidationError('El espacio no está disponible');
    const existing = await this.reservationRepository.findAll({
      userId: user.id,
      status: 'active',
    });
    if (existing.length) throw new ValidationError('Ya tienes una reserva activa');
    const from = reservationDate ? new Date(`${reservationDate}T${reservationTime}`) : new Date();
    if (Number.isNaN(from.getTime()) || from < new Date())
      throw new ValidationError('Selecciona una fecha válida a partir de hoy');
    const duration = Number(durationMinutes);
    const [hours, minutes] = reservationTime.split(':').map(Number);
    const until = new Date(from.getTime() + duration * 60000);
    const weekday = new Date(`${reservationDate}T12:00:00`).getDay();
    const startMinutes = from.getHours() * 60 + from.getMinutes();
    const endMinutes = until.getHours() * 60 + until.getMinutes();
    if (weekday === 0 || weekday === 6)
      throw new ValidationError('El coworking solo funciona de lunes a viernes');
    if (![15, 30, 45, 60].includes(duration))
      throw new ValidationError('La duración debe ser de 15, 30, 45 o 60 minutos');
    if (!Number.isInteger(hours) || ![0, 15, 30, 45].includes(minutes))
      throw new ValidationError('La hora debe estar en intervalos de 15 minutos');
    if (startMinutes < 480 || endMinutes > 1200)
      throw new ValidationError('El horario de atención es de 08:00 a 20:00');
    const reservation = await this.reservationRepository.create({
      userId: user.id,
      spaceId,
      startsAt: from.toISOString(),
      endsAt: until.toISOString(),
      status: 'active',
    });
    await this.spaceRepository.update(spaceId, {
      status: 'occupied',
      occupiedBy: user.name,
      occupiedByEmail: user.email,
      reservationId: reservation.id,
      occupiedFrom: from.toISOString(),
      availableAt: until.toISOString(),
    });
    return reservation;
  }
  async listForUser(userEmail) {
    const user = await this.userRepository.findByEmail(userEmail);
    return user ? this.reservationRepository.findAll({ userId: user.id }) : [];
  }
  async cancel({ userEmail, reservationId }) {
    const user = await this.userRepository.findByEmail(userEmail);
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation || reservation.userId !== user?.id)
      throw new NotFoundError('Reserva no encontrada');
    const startsAt = new Date(reservation.startsAt);
    const minutesUntilStart = (startsAt.getTime() - Date.now()) / 60000;
    if (minutesUntilStart <= 30)
      throw new ValidationError(
        'La reserva no puede cancelarse dentro de los 30 minutos previos a su inicio ni después de comenzar'
      );
    await this.reservationRepository.update(reservationId, { status: 'cancelled' });
    await this.spaceRepository.update(reservation.spaceId, {
      status: 'available',
      occupiedBy: null,
      occupiedFrom: null,
      availableAt: null,
      occupiedByEmail: null,
      reservationId: null,
    });
    return { ...reservation, status: 'cancelled' };
  }
}
