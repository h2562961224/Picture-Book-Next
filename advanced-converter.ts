import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

interface ConversionOptions {
    batchSize: number;
    quality: number;
    skipExisting: boolean;
    logFile?: string;
    maxRetries: number;
}

class ImageConverter {
    private processedCount = 0;
    private errorCount = 0;
    private skippedCount = 0;
    private startTime = Date.now();
    
    constructor(private options: ConversionOptions) {}
    
    async* walkDirectory(dir: string): AsyncGenerator<string> {
        try {
            const entries = await readdir(dir);
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry);
                const stats = await stat(fullPath);
                
                if (stats.isDirectory()) {
                    yield* this.walkDirectory(fullPath);
                } else if (stats.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(fullPath)) {
                    yield fullPath;
                }
            }
        } catch (error) {
            console.error(`Error reading directory ${dir}:`, error);
        }
    }
    
    async convertImages(inputDir: string, outputDir: string) {
        const batch: string[] = [];
        let totalFiles = 0;
        
        console.log('开始转换图片...');
        
        for await (const filePath of this.walkDirectory(inputDir)) {
            totalFiles++;
            batch.push(filePath);
            
            if (batch.length >= this.options.batchSize) {
                await this.processBatch(batch, inputDir, outputDir);
                this.logProgress(totalFiles);
                batch.length = 0;
                
                // 内存清理
                if (global.gc) {
                    global.gc();
                }
                
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
        
        if (batch.length > 0) {
            await this.processBatch(batch, inputDir, outputDir);
        }
        
        this.logFinalStats();
    }
    
    private async processBatch(filePaths: string[], inputDir: string, outputDir: string) {
        const promises = filePaths.map(filePath => 
            this.convertSingleFile(filePath, inputDir, outputDir)
        );
        
        await Promise.all(promises);
    }
    
    private async convertSingleFile(filePath: string, inputDir: string, outputDir: string) {
        try {
            const relativePath = path.relative(inputDir, filePath);
            const outputPath = path.join(
                outputDir, 
                relativePath.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif')
            );
            
            // 检查是否已存在
            if (this.options.skipExisting && fs.existsSync(outputPath)) {
                this.skippedCount++;
                return;
            }
            
            await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
            
            await sharp(filePath)
                .avif({ 
                    quality: this.options.quality,
                    effort: 4 // 平衡速度和压缩率
                })
                .toFile(outputPath);
                
            this.processedCount++;
        } catch (error) {
            this.errorCount++;
            console.error(`转换失败 ${filePath}:`, error);
            
            if (this.options.logFile) {
                fs.appendFileSync(this.options.logFile, `ERROR: ${filePath} - ${error}\n`);
            }
        }
    }
    
    private logProgress(totalScanned: number) {
        const elapsed = (Date.now() - this.startTime) / 1000;
        const rate = this.processedCount / elapsed;
        
        console.log(`进度: 已扫描 ${totalScanned}, 已转换 ${this.processedCount}, 跳过 ${this.skippedCount}, 错误 ${this.errorCount}, 速度 ${rate.toFixed(2)} 文件/秒`);
    }
    
    private logFinalStats() {
        const elapsed = (Date.now() - this.startTime) / 1000;
        console.log(`\n转换完成！`);
        console.log(`总耗时: ${elapsed.toFixed(2)} 秒`);
        console.log(`成功转换: ${this.processedCount} 个文件`);
        console.log(`跳过文件: ${this.skippedCount} 个文件`);
        console.log(`转换失败: ${this.errorCount} 个文件`);
        console.log(`平均速度: ${(this.processedCount / elapsed).toFixed(2)} 文件/秒`);
    }
}

// 使用示例
const converter = new ImageConverter({
    batchSize: 50,
    quality: 70,
    skipExisting: true,
    logFile: 'conversion-errors.log',
    maxRetries: 2
});

const inputDir = '/Users/chuzhen/IdeaProjects/Picture-Book-Next/picture_book_next/crawler/data/huibenbao/images';
const outputDir = '/Users/chuzhen/IdeaProjects/Picture-Book-Next/picture_book_next/crawler/data/huibenbao/images-avif';

converter.convertImages(inputDir, outputDir)
    .then(() => console.log('转换任务完成'))
    .catch(err => console.error('转换过程出错:', err));