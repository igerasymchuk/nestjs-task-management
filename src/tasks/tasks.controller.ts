import { Controller, Get, Post, Delete, Patch, Body, Param, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
//import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto, PatchTasksDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('tasks')
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');

    constructor (private taskService: TasksService) { }

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User,
        ): Promise<Task[]> {
        this.logger.log(`User '${user.username}' retrieving all tasks. Filters: ${ JSON.stringify(filterDto)}`);
        //this.logger.verbose('verbose');
        this.logger.debug('debug');
        this.logger.error('error');
        this.logger.warn('warn');
        return this.taskService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        ): Promise<Task> {
        console.log('getTaskById');
        return this.taskService.getTaskById(id, user);
    }

    @Post()
    @ApiCreatedResponse({
        description: 'The task has been successfully created.',
        type: Task,
    })
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task>  {
        this.logger.log(`User '${user.username}' creating a new task. Data: ${ JSON.stringify(createTaskDto)}`);
        return this.taskService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        ): Promise<void> {
        console.log('deleteTask');
        return this.taskService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    @ApiBody({ type: PatchTasksDto, required: false })
    //@Query(ValidationPipe) filterDto: PatchTasksDto,
    async updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User,
    ): Promise<Task> {
        return await this.taskService.updateTaskStatus(id, status, user);
    }


    // @Get()
    // getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
    //     console.log('getTasks');
    //     if (Object.keys(filterDto).length) {
    //         return this.taskService.getTasksWithFilters(filterDto);
    //     } else {
    //         return this.taskService.getAllTasks();
    //     }
    // }

    // @Get('/:id')
    // getTaskById(@Param('id') id: string): Task {
    //     console.log('getTaskById');
    //     return this.taskService.getTaskById(id);
    // }

    // @Delete('/:id')
    // deleteTask(@Param('id') id: string): void {
    //     console.log('deleteTask');
    //     return this.taskService.deleteTask(id);
    // }

    // @Patch('/:id/status')
    // updateTaskStatus(
    //     @Param('id') id: string,
    //     @Body('status', TaskStatusValidationPipe) status: TaskStatus
    // ): Task {
    //     console.log('updateTaskStatus');
    //     return this.taskService.updateTaskStatus(id, status);
    // }

    // @Post()
    // @UsePipes(ValidationPipe)
    // createTask(@Body() createTaskDto: CreateTaskDto): Task {
    //     console.log('createTask');
    //     return this.taskService.createTask(createTaskDto);
    // }
}
