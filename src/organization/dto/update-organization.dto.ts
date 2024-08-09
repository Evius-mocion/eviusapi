import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationDto } from './create-organization.dto';
import { IsEmail, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class IOrganizationSocialMedia {
    @IsString()
    @IsOptional()
    facebookUrl?: string;

    @IsString()
    @IsOptional()
    linkedInUrl?: string;

    @IsString()
    @IsOptional()
    xUrl?: string;

    @IsString()
    @IsOptional()
    instagramUrl?: string;
}

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {

    @ValidateIf((o) => o.contactEmail !== '')
    @IsEmail()
    @IsOptional()
    contactEmail?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    contactPhone?: string;

    @IsString()
    @IsOptional()
    myWebsiteUrl?: string
    
    @IsOptional()
    @ValidateNested()
    @Type(() => IOrganizationSocialMedia)
    socialMedias?: IOrganizationSocialMedia;
}
