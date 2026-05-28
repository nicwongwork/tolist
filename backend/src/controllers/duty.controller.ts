import { Request, Response, NextFunction } from 'express';
import { DutyRepository } from '../repositories/duty.repository';

const repo = new DutyRepository();

export const getDuties = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const duties = await repo.findAll();
        res.json(duties);
    } catch (err) {
        next(err);
    }
};

export const createDuty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({
                error: {
                    message: 'Duty name is required and cannot be empty',
                    status: 400
                }
            });
        }
        if (name.length > 100) {
            return res.status(400).json({
                error: {
                    message: 'Duty name cannot exceed 100 characters',
                    status: 400
                }
            });
        }

        const newDuty = await repo.create(name.trim());
        return res.status(201).json(newDuty);
    } catch (err) {
        next(err);
    }
};

export const updateDuty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({
                error: {
                    message: 'Duty name cannot be empty',
                    status: 400
                }
            });
        }
        const updated = await repo.update(id, name.trim());
        if (!updated) {
            return res.status(404).json({
                error: {
                    message: 'Duty not found',
                    status: 404
                }
            });
        }
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

export const deleteDuty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const success = await repo.delete(id);
        if (!success) {
            return res.status(404).json({
                error: {
                    message: 'Duty not found',
                    status: 404
                }
            });
        }
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};