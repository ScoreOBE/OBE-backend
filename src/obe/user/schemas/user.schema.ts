import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ROLE } from 'src/common/enum/role.enum';
import { Course } from 'src/obe/course/schemas/course.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: true })
  studentId: string;

  @Prop()
  firstNameTH: string;

  @Prop()
  lastNameTH: string;

  @Prop()
  firstNameEN: string;

  @Prop()
  lastNameEN: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  facultyCode: string;

  @Prop()
  departmentCode: string[];

  @Prop({ required: true, enum: ROLE })
  role: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] })
  enrollCourses: Course[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] })
  ownCourses: Course[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] })
  coCourses: Course[];
}

export const UserSchema = SchemaFactory.createForClass(User);
