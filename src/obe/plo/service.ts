import { BadRequestException, Injectable } from '@nestjs/common';
import { PLO } from './schemas/schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ROLE } from 'src/common/enum/role.enum';
import { Faculty } from '../faculty/schemas/schema';
import { sortData } from 'src/common/function/function';
import { TEXT_ENUM } from 'src/common/enum/text.enum';

@Injectable()
export class PLOService {
  constructor(
    @InjectModel(PLO.name) private readonly model: Model<PLO>,
    @InjectModel(Faculty.name) private readonly facultyModel: Model<Faculty>,
    // @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    // @InjectModel(CourseManagement.name)
    // private readonly courseManagementModel: Model<CourseManagement>,
  ) {}
  async searchPLO(facultyCode: string, searchDTO: any): Promise<any> {
    try {
      const isSAdmin = searchDTO.role == ROLE.SUPREME_ADMIN;
      const where: any = { facultyCode };
      if (!isSAdmin) {
        where.departmentCode = { $in: searchDTO.departmentCode };
      }
      if (searchDTO.manage) {
        where.isActive = true;
      }
      const faculty = await this.facultyModel.findOne({ facultyCode });
      const totalCount = await this.model.countDocuments(where);
      const data = await this.model.find(where).sort([
        ['year', 'desc'],
        ['semester', 'desc'],
      ]);
      if (searchDTO.manage || searchDTO.all) {
        return data;
      }
      const departmentCodes = isSAdmin
        ? faculty.department.map((dep) => dep.departmentCode)
        : searchDTO.departmentCode;
      const plos = departmentCodes.map((dep) => {
        return {
          departmentCode: dep,
          departmentEN: faculty.department.find(
            (code) => code.departmentCode == dep,
          ).departmentEN,
          collections: [],
        };
      });
      plos.forEach((plo, index) => {
        data.forEach((collection) => {
          if (collection.departmentCode.includes(plo.departmentCode)) {
            plo.collections.push(collection);
          }
        });
      });
      const filteredPLOs = plos.filter((plo) => plo.collections.length > 0);
      sortData(filteredPLOs, 'departmentEN', 'string');
      return { totalCount, plos: filteredPLOs };
    } catch (error) {
      throw error;
    }
  }

  async checkCanCreatePLO(requestDTO: any): Promise<any> {
    try {
      const existPLO = await this.model.findOne({ name: requestDTO.name });
      if (existPLO) {
        throw new BadRequestException({
          title: 'PLO name existing',
          message: `${existPLO.name} already exist.`,
        });
      }
      return TEXT_ENUM.Success;
    } catch (error) {
      throw error;
    }
  }

  async createPLO(id: string, requestDTO: any): Promise<PLO> {
    try {
      const newPLO = await this.model.create(requestDTO);
      return newPLO;
    } catch (error) {
      throw error;
    }
  }

  async updatePLO(id: string, requestDTO: any): Promise<PLO> {
    try {
      const updatePLO = await this.model.findByIdAndUpdate(id, {
        data: requestDTO.data,
      });
      return updatePLO;
    } catch (error) {
      throw error;
    }
  }
}
