import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Role, UserStatus } from '@prisma/client';

@Controller('usuario')
export class UsuarioController {

    constructor(private usuarioService: UsuarioService) { }

    @Get()
    getAll() {
        return this.usuarioService.findAll();
    }

    @Get('nombre/:nombre')
    getName(@Param('nombre') nombre: string) {
        return this.usuarioService.findName(nombre);
    }

    @Get('buscar/:term')
    search(@Param('term') term: string) {
        return this.usuarioService.searchByName(term);
    }

    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.usuarioService.findOne(id);
    }

    @Get('filtrar/:status')
    filtrarPorEstado(@Param('status') status: UserStatus) {
        return this.usuarioService.findByStatus(status);
    }

    // @Get('dni/:dni')
    // checkDni(@Param('dni') dni: string) {
    //     return this.usuarioService.findByDni(Number(dni));
    // }

    @Post()
    create(@Body() body: { nombre: string; password: string; role?: Role; lastname: string; email: string; dni: number }) {
        return this.usuarioService.createUser(body);
    }

    @Put('habilitar/:id')
    enable(@Param('id') id: string) {
        return this.usuarioService.enableUser(id);
    }

    @Put('deshabilitar/:id')
    disable(@Param('id') id: string) {
        return this.usuarioService.disableUser(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: Partial<{ nombre: string; password: string; role: Role; lastname: string; email: string; dni: number }>,) {
        return this.usuarioService.updateUser(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usuarioService.deleteUser(id);
    }

    @Post('login')
    login(@Body() body: { nombre: string; password: string;}) {
        return this.usuarioService.verifyPassword(body.nombre, body.password);
    }
}
