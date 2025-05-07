import { Schema, model } from 'mongoose';
import validator from 'validator';

interface SongInterface extends Document {
    title: string,
    author: string,
    genre: 'Pop' | 'Rock' | 'Jazz' | 'Blues',
    length: number
}

const SongSchema = new Schema<SongInterface>( {
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: (value: string) => {
            if (!validator.default.isAlphanumeric(value)) {
                throw new Error('El título de la canción ha de estar formado por caracteres alfanuméricos.');
            }
        }
    },
    author: {
        type: String,
        required: true,
        trim: true,
        validate: (value: string) => {
            if (!validator.default.isAlphanumeric(value)) {
                throw new Error('El campo del autor de la canción ha de estar formado por caracteres alfanuméricos.');
            }
        }
    },
    genre: {
        type: String,
        required: true,
        enum: ['Pop', 'Rock', 'Jazz', 'Blues']
    },
    length: {
        type: Number,
        required: true,
        validate: (value: number) => {
            if (value <= 0) {
                throw new Error('La duración de la canción no puede ser menor o igual a 0.');
            }
        }
    }
});

export const Song = model<SongInterface>('Song', SongSchema);