import { Pipe, PipeTransform } from '@angular/core';
import { ProjectType } from '../../core/models/project-type';

@Pipe({
  name: 'projectType',
  standalone: true,
})
export class ProjectTypePipe implements PipeTransform {
  transform(type: ProjectType): string {
    if (!type) return '';

    return type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }
}
