import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Verifica se já existe um usuário com esse e-mail
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new ConflictException('E-mail já cadastrado');
    }

    // 2. Cria o hash da senha (10 rounds de salt)
    const password_hash = await bcrypt.hash(dto.password, 10);

    // 3. Salva no banco de dados
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password_hash,
      },
    });

    // Retorna sem expor o hash da senha
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };
  }

  async login(dto: LoginDto) {
    // 1. Busca o usuário pelo e-mail
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // 2. Compara a senha enviada com o hash salvo
    const passwordMatches = await bcrypt.compare(dto.password, user.password_hash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // 3. Gera e retorna o token JWT
    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}